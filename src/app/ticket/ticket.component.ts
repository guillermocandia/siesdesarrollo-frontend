import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material';
import { Sort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { PageEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Ticket } from '../_model/index';
import { State } from '../_model/index';

import { TicketService } from '../_services/index';
import { StateService } from '../_services/index';

import { DeleteDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
})
export class TicketComponent implements OnInit {
  private tickets: Ticket[];
  states: State[];

  displayedColumns = [
    'title',
    'description',
    'created_at',
    'state',
    'actions'
  ];

  dataSource = new MatTableDataSource(this.tickets);

  paginatorOptions = {
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  };

  private limit = this.paginatorOptions.pageSize;
  private offset = 0;
  private searchText = '';
  private state = '';

  searchForm = new FormGroup ({
    searchInput: new FormControl(),
    stateSelect: new FormControl()
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _ticketService: TicketService,
              private _stateService: StateService,
              private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm();
    this.getTickets();
    this.getStates();
  }

  getTickets() {
    this._ticketService.getAll(this.limit, this.offset, this.searchText,
      this.sort, this.state)
    .subscribe(
      data => {
        this.paginatorOptions.length = data['count'];
        this.tickets = data['results'];
        this.dataSource = new MatTableDataSource(this.tickets);
        this.dataSource.sort = this.sort;
      }
    );
  }

  getStates() {
    this._stateService.getAll(null, null, null, null)
    .subscribe(
      data => {
        this.states = data;
      }
    );
  }

  pageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getTickets();
  }

  createForm() {
    this.searchForm = this._fb.group({
      searchInput: [''],
      stateSelect: ['']
    });
  }

  get searchInput() { return this.searchForm.get('searchInput'); }
  get stateSelect() { return this.searchForm.get('stateSelect'); }

  search() {
    this.searchText = this.searchInput.value;
    this.state = this.stateSelect.value;

    if (this.searchText !== '' || this.state !== '') {
      this.offset = 0;
      this.paginator.pageIndex = 0;
      this.getTickets();
    } else {
      this._snackBar.open('Ingrese término a buscar', '', {
        duration: 3000,
        panelClass: 'snackBar-error'
      });
    }
  }

  clear() {
    this.searchText = '';
    this.state = '';
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.sort.direction = '';
    this.getTickets();
    this.searchForm.reset();
  }

  sortTable(event: MatSort) {
    if (this.tickets.length === 0) {
      return;
    }
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.getTickets();
  }

  getStateName(id) {
    if (id === undefined) {
      return '';
    }
    return this.states.find(x => x.id === id).name;
  }

}
