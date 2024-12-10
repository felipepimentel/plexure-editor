import YAML from 'yaml';

export function formatYaml(content: string): string {
  try {
    const parsed = YAML.parse(content);
    return YAML.stringify(parsed, { indent: 2 });
  } catch (error) {
    console.error('Failed to format YAML:', error);
    return content;
  }
}

export function convertYamlToJson(content: string): string {
  try {
    const parsed = YAML.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    console.error('Failed to convert YAML to JSON:', error);
    return content;
  }
}

export function convertJsonToYaml(content: string): string {
  try {
    const parsed = JSON.parse(content);
    return YAML.stringify(parsed, { indent: 2 });
  } catch (error) {
    console.error('Failed to convert JSON to YAML:', error);
    return content;
  }
}