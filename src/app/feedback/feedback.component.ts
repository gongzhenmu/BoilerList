import { Component, OnInit } from '@angular/core';
import { ProfileService } from "../profile/profile.service";
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(private ps: ProfileService) { }

  ngOnInit() {
  }
  add(feedback: string): void {
    if (!feedback) {
      return;
    }
    this.ps.sendFeedback(feedback);
  }
}
