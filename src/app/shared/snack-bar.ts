import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SnackBar{

    constructor(
        private snackBar: MatSnackBar
    ) { }

    public openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 4000
        });
    }
}