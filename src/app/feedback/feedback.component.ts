import { Component, OnInit } from '@angular/core';
import { ProfileService } from "../profile/profile.service";
import { Router } from '@angular/router'
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(private ps: ProfileService,
    private router: Router) { }

  ngOnInit() {
  }
  add(feedback: string): void {
    if (!feedback) {
      alert("Feedback cannot be empty!");
      return;
    }
    this.ps.sendFeedback(feedback).subscribe(() => {
      alert("Successful! Thank you for your feedback!");
      this.router.navigate(['/'])
    });

  }
}
