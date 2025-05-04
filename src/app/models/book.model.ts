export interface IBook {
    id?: number;
    title?: string;
    author?: string;
    cover?: string; 
    rating?: number;
    comment?: string; 
  }

export class Book implements IBook {
        id?: number;
        title?: string;
        author?: string;
        cover?: string;
        rating?: number;
        comment?: string;
}
