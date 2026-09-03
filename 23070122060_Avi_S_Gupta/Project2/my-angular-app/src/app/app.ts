import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly document = inject(DOCUMENT);

  /** Port 4200 is the Angular dev server container; port 80 is the Nginx production container. */
  protected readonly environmentLabel =
    this.document.location.port === '4200'
      ? 'Development container (ng serve, hot reload)'
      : 'Production container (Nginx)';

  protected readonly renderedAt = new Date().toLocaleString();
}
