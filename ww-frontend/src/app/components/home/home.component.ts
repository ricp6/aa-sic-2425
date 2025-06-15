import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { SimpleTrack } from '../../interfaces/track';
import { Router } from '@angular/router';
import { TrackService } from '../../services/track.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tracks: SimpleTrack[] | null = null;

  @ViewChild('heroImage', { static: true }) heroImage!: ElementRef;

  constructor(
    private readonly router: Router,
    private readonly tracksService: TrackService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tracksService.getTracksCached().subscribe({
      next: (tracks) => {
        this.tracks = tracks.filter(track => track.available);
      },
      error: () => {
        this.toastr.warning("Por favor, atualize a página ou tente novamente mais tarde.", "Desculpe! Não conseguimos carregar as pistas.");
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;
    if (this.heroImage) {
      this.heroImage.nativeElement.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
  }

  showTrack(track: SimpleTrack) {
    this.router.navigate(['/tracks', track.id], {
      state: { track: track }
    });
  }
}
