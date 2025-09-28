import { Layer, type LayerArgs } from './Layer.js'
import type { Input } from './utils/Input.js'


export class MainMenu extends Layer {
  
  public constructor(args: MainMenuArgs) {
    super(args)
  }

  public update(input: Input): number {
    // no op
    return 1000
  }

  public render(): void {
    // no op
  }

}


type MainMenuArgs = LayerArgs & {}