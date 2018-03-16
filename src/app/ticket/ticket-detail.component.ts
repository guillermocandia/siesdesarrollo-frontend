import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { State } from '../_model/index';
import { Ticket } from '../_model/index';

import { StateService } from '../_services/index';
import { TicketService } from '../_services/index';


@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent implements OnInit {
  constructor(private _stateService: StateService,
              private _ticketService: TicketService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}

  private category: string[];
  private brand: string;
  private ticket: Ticket;
  private tickets: Ticket[];
  private new = false;

  states: State[];

  ticketForm = new FormGroup ({
    id: new FormControl(),
    title: new FormControl(),
    description: new FormControl(),
    created_at: new FormControl(),
    stateSelect: new FormControl(),
  });

  ngOnInit() {
    this.getStates();
    this.createForm();
    this.getTicket();
  }

  createForm() {
    this.ticketForm = this._fb.group({
      id: [''],
      title: ['', Validators.required ],
      description: ['', [Validators.required, Validators.min(0) ]],
      created_at: [''],
      stateSelect: []
    });
  }

  get id() { return this.ticketForm.get('id'); }
  get title() { return this.ticketForm.get('title'); }
  get description() { return this.ticketForm.get('description'); }
  get created_at() { return this.ticketForm.get('created_at'); }
  get stateSelect() { return this.ticketForm.get('stateSelect'); }


  getStates() {
    this._stateService.getAll(null, null, null, null)
    .subscribe(
      data => {
        this.states = data;
      }
    );
  }

  getTicket(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.ticket = new Ticket();
      this.new = true;
      return;
    }
    this._ticketService.get(id)
    .subscribe(
      data => {
        this.ticket = data;
        this.id.setValue(data.id);
        this.title.setValue(data.title);
        this.description.setValue(data.description);
        this.created_at.setValue(data.created_at.toLocaleString('es-Cl'));
        this.created_at.disable();
        this.stateSelect.setValue(data.state);
      }
    );
  }

  save(): void {
    this.ticket.title = this.title.value;
    this.ticket.description = this.description.value;
    this.ticket.created_at = this.created_at.value;
    this.ticket.state = this.stateSelect.value;

    this._ticketService.save(this.ticket)
    .subscribe(
      (data: Ticket|any) => {
        if (data['status'] === 403) {
          this._snackBar.open('No autorizado', '', {
            duration: 3000,
            panelClass: 'snackBar-error'
          });
          return;
        }
        this.ticket = data;
        this._snackBar.open('Ticket guardado', '', {
          duration: 3000,
          panelClass: 'snackBar-success'
        });
        this.back();
      }
    );
  }


  cancel () {
    this.back();
  }

  back () {
    this._location.back();
  }

}
