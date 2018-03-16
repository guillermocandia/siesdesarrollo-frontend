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

import { State } from '../_model/index';

import { StateService } from '../_services/index';

import { DeleteDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
})
export class StateComponent implements OnInit {
  private states: State[];
  displayedColumns = ['name', 'actions'];
  dataSource = new MatTableDataSource(this.states);

  paginatorOptions = {
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  };

  private limit = this.paginatorOptions.pageSize;
  private offset = 0;
  private searchText: string | null = null;

  searchForm = new FormGroup ({
    searchInput: new FormControl()
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _stateService: StateService,
              private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getStates();
  }

  getStates() {
    this._stateService.getAll(this.limit, this.offset, this.searchText, this.sort)
    .subscribe(
      data => {
        this.paginatorOptions.length = data['count'];
        this.states = data['results'];
        this.dataSource = new MatTableDataSource(this.states);
        this.dataSource.sort = this.sort;
      }
    );
  }

  pageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getStates();
  }

  createForm() {
    this.searchForm = this._fb.group({
      searchInput: ['', Validators.required ]
    });
  }

  get searchInput() { return this.searchForm.get('searchInput'); }

  search() {
    this.searchText = this.searchInput.value;
    if (this.searchText !== null && this.searchText !== '') {
      this.offset = 0;
      this.paginator.pageIndex = 0;
      this.getStates();
    } else {
      this._snackBar.open('Ingrese término a buscar', '', {
        duration: 3000,
        panelClass: 'snackBar-error'
      });
    }
  }

  clear() {
    this.searchText = null;
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.sort.direction = '';
    this.getStates();
    this.searchForm.reset();
  }

  sortTable(event: MatSort) {
    if (this.states.length === 0) {
      return;
    }
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.getStates();
  }

  delete(element) {
    const dialogRef: MatDialogRef<DeleteDialogComponent> = this._dialog.open(DeleteDialogComponent, {
      data: { subject: 'Estado', data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._stateService.delete(element.id)
        .subscribe(
          data => {
            if (data !== null && data['status'] === 403) {
              this._snackBar.open('No autorizado', '', {
                duration: 3000,
                panelClass: 'snackBar-error'
              });
            }
            this.getStates();
          }
        );
      }
    });
  }

}
