import { Injectable } from '@angular/core';
import {SETTINGS} from '../config/common.settings';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }
  postFile(file: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(`${SETTINGS.BASE_API}/files/upload`, formData);
  }
}
