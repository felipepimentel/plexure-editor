import { authService } from '../services/authService';
import { specificationService } from '../services/specificationService';
import { sampleSpecifications } from '../data/sampleSpecifications';

export async function initializeSupabase() {
  try {
    console.log('Initializing application...');

    // Attempt to authenticate
    const user = await authService.signIn();
    if (!user) {
      console.error('Failed to authenticate');
      return null;
    }

    console.log('Authentication successful');

    // Check if we need to seed data
    try {
      const specs = await specificationService.list();
      if (!specs || specs.length === 0) {
        console.log('Seeding initial specifications...');
        
        for (const spec of sampleSpecifications) {
          await specificationService.create(spec);
        }
        
        console.log('Data seeding complete');
      }
    } catch (error) {
      console.error('Error checking/seeding specifications:', error);
    }

    return user.id;
  } catch (error) {
    console.error('Application initialization failed:', error);
    return null;
  }
}