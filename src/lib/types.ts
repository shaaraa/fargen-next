// types.ts

export interface ImageResult {
    images: Array<{
      url: string;
      width: number;
      height: number;
      content_type: string;
    }>;
    timings: { inference: number };
    seed: number;
    has_nsfw_concepts: boolean[];
    prompt: string;
  }