import type { Breed } from './Breed.js'
import { RockEaterBreed, type RockEaterUpgrade } from './RockEaterBreed.js'


export type BreedType =
  | 'rockEater'
  | 'ghost'
  | 'bomber'


export function createBreed(type: BreedType): Breed<BreedUpgrade> {
  switch (type) {
    case 'rockEater':
      return new RockEaterBreed()
    case 'ghost':
    case 'bomber':
      throw new Error('breed not implement yet')
  }
}


export type BreedUpgrade =
  | RockEaterUpgrade