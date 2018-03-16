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

import { StateService } from '../_services/index';


@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.html',
})
export class StateDetailComponent implements OnInit {
  constructor(private _stateService: StateService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}

  private state: State;

  stateForm = new FormGroup ({
    id: new FormControl(),
    name: new FormControl()
  });

  ngOnInit() {
    this.createForm();
    this.getState();
  }

  createForm() {
    this.stateForm = this._fb.group({
      id: [''],
      name: ['', Validators.required ]
    });
  }

  get id() { return this.stateForm.get('id'); }
  get name() { return this.stateForm.get('name'); }

  getState(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.state = new State();
      return;
    }
    this._stateService.get(id)
    .subscribe(
      data => {
        this.state = data;
        this.id.setValue(data.id);
        this.name.setValue(data.name);
      }
    );
  }

  save(): void {
    this.state.name = this.name.value;
    this._stateService.save(this.state)
    .subscribe(
      (data: State|any) => {
        if (data['status'] === 403) {
          this._snackBar.open('No autorizado', '', {
            duration: 3000,
            panelClass: 'snackBar-error'
          });
          return;
        }
        this.state = data;
        this._snackBar.open('Estado guardada', '', {
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
