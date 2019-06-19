import { Component, OnInit,ElementRef, OnDestroy,Renderer,AfterViewInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Router } from '@angular/router';
import { ITask } from 'app/shared/model/task.model';
import { AccountService } from 'app/core';
import { TaskService } from './task.service';
import * as $ from 'jquery';
import 'datatables.net';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'jhi-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit, OnDestroy,AfterViewInit {
  tasks: ITask[];
  currentAccount: any;
  eventSubscriber: Subscription;
  @ViewChild("datatable",{static : false}) table : ElementRef<HTMLTableElement>;
  taskTable : any;
  dtOptions : any;

  constructor(
    protected taskService: TaskService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService,
    protected renderer: Renderer, 
    protected router: Router
  ) {}

  loadAll() {
    this.taskService
      .query()
      .pipe(
        filter((res: HttpResponse<ITask[]>) => res.ok),
        map((res: HttpResponse<ITask[]>) => res.body)
      )
      .subscribe(
        (res: ITask[]) => {
          this.tasks = res;
          this.dtOptions = {
            "data" :  this.tasks,
            "lengthMenu": [ 5, 10, 15, 20, "All" ],
            "columns" : [
              {"title":"Title","data":"title"},
              {"title":"Category","data":"category.name"},
              {"title":"","data":"id"}
            ],
            "columnDefs": [ {
              "targets": 2,
              "data": "id",
              "render": function (data: any, type: any, full: any) {
                return '<button type="submit" view-task-id='+data+' class="btn btn-info btn-sm">View</button>'+
                '<button type="submit" edit-task-id='+data+' class="btn btn-primary btn-sm">Edit</button>';
              }
          } ]
          }
          this.taskTable = $(this.table.nativeElement);
          this.taskTable.DataTable(this.dtOptions);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInTasks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ITask) {
    return item.id;
  }

  registerChangeInTasks() {
    this.eventSubscriber = this.eventManager.subscribe('taskListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
  
  ngAfterViewInit(): void {
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("view-task-id")) {
        this.router.navigate(["/task" ,event.target.getAttribute("view-task-id"),'view']);
      }else if(event.target.hasAttribute("edit-task-id")){
        this.router.navigate(["/task" ,event.target.getAttribute("edit-task-id"),'edit']);
      }
    });
  }
}
