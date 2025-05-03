import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BookService } from './services/bookService.service';
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FloatLabelModule, TextareaModule, CardModule, InputTextModule, ButtonModule, RatingModule, FileUpload, MessageModule, ToastModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, BookService]
})
export class AppComponent implements OnInit {
  bookTitle: string | undefined;
  bookComment: string | undefined;
  bookRating: number | undefined;
  bookCover: any;
  bookAuthor: string | undefined;

  uploadedFiles: any[] = [];
  msg: string = '';
  books: Book[] = [];

  constructor(
    private messageService: MessageService,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.getBooks();
  }
  onUpload(event: FileUploadEvent) {
    if (event.files && event.files.length > 0) {
      this.bookCover = event.files[0];
      this.messageService.add({ severity: 'info', summary: 'Book Cover uploaded successfully', detail: '' });
    }
  }

  onClick() {
    this.msg = 'Welcome! Add the book from below';
  }

  getBooks() {
    this.bookService.getBooks().subscribe(
      (data: Book[]) => {
        this.books = data;
      },
      (error: any) => {
        console.error('Error fetching books:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load books.' });
      }
    );
  }

  addBook() {
    if (this.bookTitle && this.bookAuthor && this.bookRating && this.bookCover) {

      console.log(this.bookCover)
      var newBook = new Book();
      newBook.Title = this.bookTitle;
      newBook.Author = this.bookAuthor;
      newBook.Rating = this.bookRating;
      newBook.Comment = this.bookComment;
      newBook.Cover = this.bookCover;
      console.log(newBook)

      this.bookService.addBook(newBook).subscribe(
        () => {
          this.getBooks();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book added successfully.' });
          this.clearForm();
        },
        (error: any) => {
          console.error('Error adding book:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add book.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in required* fields.' });
    }
  }

  clearForm() {
    this.bookTitle = '';
    this.bookComment = '';
    this.bookRating = 0;
    this.bookCover = null;
    this.bookAuthor = '';
  }
}

