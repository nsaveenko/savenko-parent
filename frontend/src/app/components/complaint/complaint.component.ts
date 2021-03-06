import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {Subscription} from "rxjs";
import {ComplaintService} from "../../services/complaint.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Complaint} from "../../models/Complaint";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {

  public complaint: Complaint[];
  public post: Post[];
  private subscriptions: Subscription[] = [];
  public editableComplaint: Complaint = new Complaint();
  form: FormGroup;
  public postId;

  constructor(private complaintService: ComplaintService,
              private postService: PostService,
              private userService: UserService,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      complaint: new FormControl("", [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern('^[A-Z\'\\-.,:!?;a-z0-9]{1}[A-Z \'\\-.,:!?;a-z0-9]+$'),
        ]
      ),
      isRemember: new FormControl()
    });
  }

  public addComplaint(textValue: string): void {
    this.editableComplaint.dateComplaint = Date.now();
    this.editableComplaint.idUser = this.userService.currUser.id;
    this.editableComplaint.complaint = textValue;
    this.editableComplaint.idStatusComplaint = 2;
    this.postId = this.postService.currPost.id;
    this.editableComplaint.postId = this.postId;

    this.subscriptions.push(this.complaintService.saveComplaint(this.editableComplaint).subscribe((complaint: Complaint) => {
      this.router.navigate(['/']);
    }));
  }
}
