export interface IBook {
    Id?: number;
    Title?: string;
    Author?: string;
    Cover?: string; 
    Rating?: number;
    Comment?: string;
}

export class Book implements IBook {
    Id?: number;
    Title?: string;
    Author?: string;
    Cover?: string; 
    Rating?: number;
    Comment?: string;
}
