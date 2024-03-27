import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Artist, Category, MediaType, Movie, ParentalRating, Serie } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateMedia {
  title: string,
  description: string,
  releaseDate: string,
  directorId: string,
  artistsIds: string[],
  categoriesIds: string[]
  parentalRating: ParentalRating,
  type: MediaType,
  movie?: {
    duration: number
  }
  serie?: {
    seasons: {
      episodes: {
        title: string,
        description: string,
        duration: number
      }[]
    }[]
  },
}

@Injectable()
export class CreateMediaUseCase {
  constructor(private prisma: PrismaService) { }

  async execute({
    title,
    artistsIds,
    categoriesIds,
    description,
    directorId,
    parentalRating,
    type,
    releaseDate,
    movie,
    serie
  }: CreateMedia) {
    try {
      if (movie && serie) {
        throw new BadRequestException(
          'A mídia deve ser de um único tipo(filme ou série).'
        );
      }

      if (movie || serie) {
        const artists = await this.prisma.artist.findMany({
          where: {
            id: {
              in: artistsIds
            }
          }
        })

        const allArtistsExists = verifyArtistInArtistsIds(artists, artistsIds)

        if (allArtistsExists) {
          const director = await this.prisma.director.findUnique({
            where: {
              id: directorId
            }
          })

          if (director) {
            const categories = await this.prisma.category.findMany({
              where: {
                id: {
                  in: categoriesIds
                }
              }
            })

            const allCategoriesExists = verifyCategoriesInCategoriessIds(
              categories,
              categoriesIds
            )

            if (allCategoriesExists) {
              let createdMovie: Movie | undefined = undefined
              let createdSerie: Serie | undefined = undefined

              if (type === MediaType.MOVIE && movie) {
                createdMovie = await this.prisma.movie.create({
                  data: movie
                })
              }

              if (type === MediaType.SERIE && serie) {
                createdSerie = await this.prisma.serie.create({
                  data: {
                    seasons: {
                      create: serie?.seasons.map(season => ({
                        episodes: {
                          create: season.episodes.map(episode => ({
                            title: episode.title,
                            description: episode.description,
                            duration: episode.duration
                          }))
                        }
                      }))
                    }
                  }
                })
              }

              const media = await this.prisma.media.create({
                data: {
                  title,
                  description,
                  parentalRating,
                  releaseDate,
                  directorId,
                  artists: {
                    connect: artistsIds.map((artistId) => ({
                      id: artistId
                    }))
                  },
                  categories: {
                    connect: categoriesIds.map((categoryId) => ({
                      id: categoryId
                    }))
                  },
                  type,
                  movieId: createdMovie?.id ?? undefined,
                  serieId: createdSerie?.id ?? undefined,
                }
              })

              return {
                media
              }
            }

            throw new NotFoundException('Categorias não encontradas.');
          }

          throw new NotFoundException('Diretor não encontrado.');
        }

        throw new NotFoundException('Artistas não encontrados.');
      }

      throw new BadRequestException(
        'A mídia deve ser do tipo filme ou série.'
      );
    } catch (error) {
      throw error;
    }
  }
}

function verifyArtistInArtistsIds(artists: Artist[], artistsIds: string[]) {
  for (const artist of artists) {
    return artistsIds.every((artistId) => artistId === artist.id)
  }
}

function verifyCategoriesInCategoriessIds(categories: Category[], categoriesIds: string[]) {
  for (const category of categories) {
    return categoriesIds.every((categoryId) => categoryId === category.id)
  }
}