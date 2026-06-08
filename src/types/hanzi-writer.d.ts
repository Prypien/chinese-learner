declare module "hanzi-writer" {
  interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    showCharacter?: boolean;
    showOutline?: boolean;
    strokeColor?: string;
    radicalColor?: string;
    highlightColor?: string;
    drawingColor?: string;
    drawingWidth?: number;
    outlineColor?: string;
    onLoadCharDataError?: (reason: string) => void;
  }

  interface QuizOptions {
    onComplete?: (data: { character: string; totalMistakes: number }) => void;
    onMistake?: (data: { strokeNum: number; mistakesOnStroke: number }) => void;
    showHintAfterMisses?: number | false;
    highlightOnComplete?: boolean;
    showOutline?: boolean;
  }

  export default class HanziWriter {
    static create(
      element: HTMLElement | string,
      character: string,
      options?: HanziWriterOptions
    ): HanziWriter;
    quiz(options?: QuizOptions): void;
    cancelQuiz(): void;
    hideCharacter(): void;
  }
}
