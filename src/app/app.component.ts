import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Message, MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Book } from './models/book.model';
import { BookService } from './services/bookService.service';
import { FileUploadEvent } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, RouterOutlet, DialogModule, FloatLabelModule, TextareaModule, CardModule, InputTextModule, ButtonModule, RatingModule, FileUpload, MessageModule, ToastModule, FormsModule, HttpClientModule],
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

  editDialogVisible: boolean = false;
  selectedBook: Book | undefined;
  editBook: Book = {};
  uploadedEditFiles: any[] = [];

  loading: boolean = false;

  uploadedFiles: any[] = [];
  msg: string = '';
  books: Book[] = [];

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(
    private messageService: MessageService,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.getBooks();
  }

  onUpload(event: FileUploadEvent) {
    this.loading = true;
    this.uploadedFiles = [];
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.uploadedFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.bookCover = reader.result;
        this.messageService.add({
          severity: 'info',
          summary: 'File Uploaded',
          detail: `${file.name} uploaded`,
        });
      };
      reader.readAsDataURL(file);
    }
    this.loading = false;
  }

  getBooks() {
    this.loading = true;
    this.bookService.getBooks().subscribe(
      (data: any[]) => {
        this.books = data;
        console.log(this.books)
      },
      (error: any) => {
        console.error('Error fetching books:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load books.',
        });
      }
    );
    this.loading = false;
  }

  updateBook() {
    this.loading = true;
    this.bookService.updateBook(this.editBook).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book updated successfully' });
      this.getBooks();
      this.editDialogVisible = false;
    },
      (error: any) => {
        console.error('Error updating book:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the book' });
      }
    );
    this.loading = false;
  }

  onEditUpload(event: any) {
    this.loading = true;
    for (let file of event.files) {
      this.uploadedEditFiles.push(file);
    }
    this.loading = false;
  }

  addBook() {
    this.loading = true;
    if (this.bookTitle && this.bookAuthor && this.bookRating && this.bookCover) {
      const newBook: Book = {
        title: this.bookTitle,
        author: this.bookAuthor,
        rating: this.bookRating,
        comment: this.bookComment,
        cover: this.bookCover,
      };

      console.log(newBook)

      this.bookService.addBook(newBook).subscribe(
        () => {
          this.getBooks();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Book added successfully.',
          });
          this.clearForm();
        },
        (error: any) => {
          console.error('Error adding book:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add book.',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in required* fields and select a file.',
      });
    }
    this.loading = false;
  }

  deleteBook(book: any) {
    if (book.id) {
      this.loading = true;
      this.bookService.deleteBook(book.id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Book deleted successfully.',
          });
          this.getBooks();
          this.loading = false;
        },
        (error: any) => {
          console.error('Error deleting book:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete book.',
          });
          this.loading = false;
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete book.',
      });
    }

  }

  openEditDialog(book: any) {
    this.selectedBook = { ...book };
    this.editBook = { ...book };
    this.editDialogVisible = true;
    this.uploadedEditFiles = [];
  }

  clearForm() {
    this.bookTitle = '';
    this.bookComment = '';
    this.bookRating = undefined;
    this.bookCover = null;
    this.bookAuthor = '';
    this.uploadedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}

