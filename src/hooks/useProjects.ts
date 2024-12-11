import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabaseClient';
import type { Project, ApiContract, ProjectMember, StyleGuide } from '../types/project';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contracts, setContracts] = useState<ApiContract[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [styleGuides, setStyleGuides] = useState<StyleGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects and select first one
  useEffect(() => {
    async function loadProjects() {
      try {
        if (!user?.id) {
          setProjects([]);
          return;
        }

        const { data, error: err } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (err) throw err;
        const projectsList = data as Project[] || [];
        setProjects(projectsList);
        
        // Auto-select first project if none is selected
        if (!selectedProject && projectsList.length > 0) {
          setSelectedProject(projectsList[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError(err instanceof Error ? err.message : 'Error loading projects');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [user?.id, selectedProject]);

  // Load project details when a project is selected
  useEffect(() => {
    async function loadProjectDetails() {
      if (!selectedProject?.id) return;

      setLoading(true);
      try {
        // Load contracts
        const { data: contractsData, error: contractsErr } = await supabase
          .from('api_contracts')
          .select('*')
          .eq('project_id', selectedProject.id)
          .order('created_at', { ascending: false });

        if (contractsErr) throw contractsErr;
        const contractsList = contractsData as ApiContract[] || [];
        setContracts(contractsList);

        // Load members
        const { data: membersData, error: membersErr } = await supabase
          .from('project_members')
          .select('*')
          .eq('project_id', selectedProject.id);

        if (membersErr) throw membersErr;
        setMembers(membersData as ProjectMember[] || []);

        // Load style guides
        const { data: guidesData, error: guidesErr } = await supabase
          .from('style_guides')
          .select('*')
          .eq('project_id', selectedProject.id)
          .eq('is_active', true);

        if (guidesErr) throw guidesErr;
        setStyleGuides(guidesData as StyleGuide[] || []);

        setError(null);
      } catch (err) {
        console.error('Error loading project details:', err);
        setError(err instanceof Error ? err.message : 'Error loading project details');
      } finally {
        setLoading(false);
      }
    }

    loadProjectDetails();
  }, [selectedProject?.id]);

  // Create new project
  const createProject = useCallback(async (
    name: string,
    description?: string,
    isPublic: boolean = false
  ): Promise<Project | null> => {
    if (!user?.id) return null;

    try {
      const { data: userData } = await supabase
        .from('user_profiles')
        .select('team_id')
        .eq('id', user.id)
        .single();

      const { data, error: err } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          owner_id: user.id,
          team_id: userData?.team_id,
          is_public: isPublic
        })
        .select()
        .single();

      if (err) throw err;

      // Add creator as owner
      const { error: memberErr } = await supabase
        .from('project_members')
        .insert({
          project_id: data.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberErr) throw memberErr;

      const project = data as Project;
      setProjects(prev => [...prev, project]);
      return project;
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Error creating project');
      return null;
    }
  }, [user?.id]);

  // Create new contract
  const createContract = useCallback(async (
    projectId: string,
    name: string,
    version: string,
    spec: string,
    description?: string
  ): Promise<ApiContract | null> => {
    if (!user?.id) return null;

    try {
      const { data, error: err } = await supabase
        .from('api_contracts')
        .insert({
          project_id: projectId,
          name,
          version,
          spec,
          description,
          status: 'draft',
          created_by: user.id,
          updated_by: user.id
        })
        .select()
        .single();

      if (err) throw err;

      const contract = data as ApiContract;
      setContracts(prev => [...prev, contract]);
      return contract;
    } catch (err) {
      console.error('Error creating contract:', err);
      setError(err instanceof Error ? err.message : 'Error creating contract');
      return null;
    }
  }, [user?.id]);

  // Update contract
  const updateContract = useCallback(async (
    contractId: string,
    updates: Partial<Omit<ApiContract, 'id' | 'created_at' | 'updated_at' | 'created_by'>>
  ): Promise<ApiContract | null> => {
    if (!user?.id) return null;

    try {
      const { data, error: err } = await supabase
        .from('api_contracts')
        .update({ ...updates, updated_by: user.id })
        .eq('id', contractId)
        .select()
        .single();

      if (err) throw err;

      const contract = data as ApiContract;
      setContracts(prev => prev.map(c => c.id === contractId ? contract : c));
      return contract;
    } catch (err) {
      console.error('Error updating contract:', err);
      setError(err instanceof Error ? err.message : 'Error updating contract');
      return null;
    }
  }, [user?.id]);

  // Create style guide
  const createStyleGuide = useCallback(async (
    projectId: string,
    name: string,
    rules: StyleGuide['rules'],
    description?: string
  ): Promise<StyleGuide | null> => {
    if (!user?.id) return null;

    try {
      const { data, error: err } = await supabase
        .from('style_guides')
        .insert({
          project_id: projectId,
          name,
          description,
          rules,
          is_active: true,
          created_by: user.id,
          updated_by: user.id
        })
        .select()
        .single();

      if (err) throw err;

      const guide = data as StyleGuide;
      setStyleGuides(prev => [...prev, guide]);
      return guide;
    } catch (err) {
      console.error('Error creating style guide:', err);
      setError(err instanceof Error ? err.message : 'Error creating style guide');
      return null;
    }
  }, [user?.id]);

  return {
    projects,
    selectedProject,
    setSelectedProject,
    contracts,
    members,
    styleGuides,
    loading,
    error,
    createProject,
    createContract,
    updateContract,
    createStyleGuide
  };
} 