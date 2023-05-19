import { base } from "../components/base";
import { creationForm } from "../components/creation-form";

export function createNewModel(prompt: string): string {
  return base({
    pageTitle: "create a new model",
    metaDescription: "create a new model",
    content: creationForm({
      samplePrompt: prompt,
    }),
  });
}
