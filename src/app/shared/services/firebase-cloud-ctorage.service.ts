import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirebaseCloudStorageService {

    private reference: AngularFireStorageReference;
    private uploadTask: AngularFireUploadTask;

    constructor(
        private fireStorage: AngularFireStorage
    ) { }

    //Завантаження файлу до Fitebase Storage
    public upload(event, way: string): string {
        const id = Math.random().toString(36).substring(2);
        this.reference = this.fireStorage.ref(way + id);
        this.uploadTask = this.reference.put(event.target.files[0]);
        return this.uploadTask.task.snapshot.ref.fullPath;
    }

    //Видалення файлу Fitebase Storage
    public delete(way: string): void {
        this.reference = this.fireStorage.ref(way);
        this.reference.delete()
    }

    //Завантаження посилання на файл з Fitebase Storage
    public download(way: string): Observable<string> {
       return this.fireStorage.ref(way).getDownloadURL();
    }
}