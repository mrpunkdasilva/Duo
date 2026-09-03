import { MediaItem } from "@/types";

export const MOCK_MOVIES: MediaItem[] = [
  {
    id: 1,
    title: "A Origem",
    overview:
      "Um ladrão que rouba segredos corporativos através do uso de tecnologia de compartilhamento de sonhos é dado a tarefa inversa de plantar uma ideia na mente de um CEO.",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3Hd1ToSc.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    vote_count: 34000,
    genre_ids: [28, 878, 12],
    media_type: "movie",
    popularity: 100.5,
  },
  {
    id: 2,
    title: "Interestelar",
    overview:
      "As reservas da Terra estão acabando e uma equipe de exploradores e cientistas é enviada viajar por um buraco de minhoca em busca de um novo lar para a humanidade.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK1DhoXUq.jpg",
    release_date: "2014-11-07",
    vote_average: 8.6,
    vote_count: 32000,
    genre_ids: [12, 18, 878],
    media_type: "movie",
    popularity: 95.2,
  },
  {
    id: 3,
    title: "O Poderoso Chefão",
    overview:
      "A história da família Corleone, uma das mais poderosas máfias dos Estados Unidos, e特别是 Don Vito Corleone, o patriarca que comanda com mão de ferro.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    release_date: "1972-03-14",
    vote_average: 8.7,
    vote_count: 18000,
    genre_ids: [18, 80],
    media_type: "movie",
    popularity: 85.3,
  },
  {
    id: 4,
    title: "Clube da Luta",
    overview:
      "Um homem insatisfeito com seu trabalho e sua vida encontra um vendedor de sabão carismático que o apresenta a um clube de luta subterrâneo.",
    poster_path: "/pB8BM7pdSp6B6Ih7QI4S2t0POD5.jpg",
    backdrop_path: "/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 26000,
    genre_ids: [18, 53],
    media_type: "movie",
    popularity: 80.1,
  },
];

export const MOCK_TV_SHOWS: MediaItem[] = [
  {
    id: 101,
    name: "Stranger Things",
    title: "Stranger Things",
    overview:
      "Quando um menino desaparece, seus amigos, a mãe e o chefe da polícia precisam enfrentar terror sobrenatural para recuperá-lo.",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "/56v2KjBlYj3Ey2t4WDrYwAmY7g.jpg",
    release_date: "2016-07-15",
    first_air_date: "2016-07-15",
    vote_average: 8.6,
    vote_count: 17000,
    genre_ids: [18, 14, 53],
    media_type: "tv",
    popularity: 90.5,
  },
  {
    id: 102,
    name: "Breaking Bad",
    title: "Breaking Bad",
    overview:
      "Um professor de química do ensino médio é diagnosticado com câncer de pulmão e decide produzir e vender metanfetamina para garantir o futuro financeiro de sua família.",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    release_date: "2008-01-20",
    first_air_date: "2008-01-20",
    vote_average: 8.9,
    vote_count: 13000,
    genre_ids: [18, 80],
    media_type: "tv",
    popularity: 88.2,
  },
  {
    id: 103,
    name: "The Last of Us",
    title: "The Last of Us",
    overview:
      "Vinte anos após a destruição da civilização moderna, um sobrevivente duro é contratado para tirar uma garota de 14 anos de uma zona de quarentena opressiva.",
    poster_path: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    backdrop_path: "/lGiDjCgIhB3SjyYcE6yCwFL0RkX.jpg",
    release_date: "2023-01-15",
    first_air_date: "2023-01-15",
    vote_average: 8.8,
    vote_count: 5000,
    genre_ids: [18, 10759],
    media_type: "tv",
    popularity: 95.8,
  },
  {
    id: 104,
    name: "Game of Thrones",
    title: "Game of Thrones",
    overview:
      "Nove famílias nobres lutam pelo controle das terras míticas de Westeros, enquanto um antigo inimigo retorna depois de dormir por milhares de anos.",
    poster_path: "/1XS1oqL89opfnbLl8WnZY1G1u0R.jpg",
    backdrop_path: "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    release_date: "2011-04-17",
    first_air_date: "2011-04-17",
    vote_average: 8.4,
    vote_count: 22000,
    genre_ids: [10765, 18, 10759],
    media_type: "tv",
    popularity: 85.0,
  },
];

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (
  path: string | null,
  size: "w200" | "w300" | "w500" | "original" = "w500"
): string => {
  if (!path) return "/placeholder-movie.png";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};
