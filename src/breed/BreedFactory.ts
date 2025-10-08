import type { Breed } from './Breed.js'
import { RockEaterBreed } from './RockEaterBreed.js'


export type BreedType =
  | 'rockEater'
  | 'ghost'
  | 'bomber'


export function createBreed(type: BreedType): Breed {
  switch (type) {
    case 'rockEater':
      return new RockEaterBreed()
    case 'ghost':
    case 'bomber':
      throw new Error('breed not implement yet')
  }
}