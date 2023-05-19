import { base } from "../components/base";
import { creationForm } from "../components/creation-form";

export async function createNewModel(prompt: string): Promise<string> {
  return await base({
    pageTitle: "create a new model",
    metaDescription: "create a new model",
    content:
      creationForm({
        samplePrompt: prompt,
      }) + `<script src="/assets/create-model.js"></script>`,
  });
}
