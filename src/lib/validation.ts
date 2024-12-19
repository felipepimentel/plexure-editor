import YAML from "yaml";

export interface ValidationMessage {
  id: string;
  type: "error" | "warning";
  message: string;
  path?: string;
}

export interface ValidationResponse {
  messages: ValidationMessage[];
  parsedSpec: any;
}

export async function validateContent(content: string): Promise<ValidationResponse> {
  try {
    // First try to parse the YAML
    const parsedSpec = YAML.parse(content);

    // Initialize messages array
    const messages: ValidationMessage[] = [];

    // Check if we have a valid object
    if (!parsedSpec || typeof parsedSpec !== "object") {
      return {
        messages: [{
          id: Date.now().toString(),
          type: "error",
          message: "Invalid YAML: Document must be a valid OpenAPI specification"
        }],
        parsedSpec: null
      };
    }

    // Validate OpenAPI version
    if (!parsedSpec.openapi && !parsedSpec.swagger) {
      messages.push({
        id: Date.now().toString(),
        type: "error",
        message: "Missing OpenAPI/Swagger version",
        path: "openapi"
      });
    }

    // Validate info object
    if (!parsedSpec.info) {
      messages.push({
        id: Date.now().toString(),
        type: "error",
        message: "Missing info object",
        path: "info"
      });
    } else {
      if (!parsedSpec.info.title) {
        messages.push({
          id: Date.now().toString(),
          type: "error",
          message: "Missing API title",
          path: "info.title"
        });
      }
      if (!parsedSpec.info.version) {
        messages.push({
          id: Date.now().toString(),
          type: "error",
          message: "Missing API version",
          path: "info.version"
        });
      }
    }

    // Validate paths object
    if (!parsedSpec.paths) {
      messages.push({
        id: Date.now().toString(),
        type: "error",
        message: "Missing paths object",
        path: "paths"
      });
    } else if (typeof parsedSpec.paths !== "object") {
      messages.push({
        id: Date.now().toString(),
        type: "error",
        message: "Paths must be an object",
        path: "paths"
      });
    }

    // Return the validation results
    // If there are any errors, return null for parsedSpec
    const hasErrors = messages.some(msg => msg.type === "error");
    return {
      messages,
      parsedSpec: hasErrors ? null : parsedSpec
    };
  } catch (error) {
    // Handle YAML parsing errors
    return {
      messages: [{
        id: Date.now().toString(),
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error"
      }],
      parsedSpec: null
    };
  }
}
