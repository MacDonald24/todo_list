import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TodolistSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [TodolistSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [TodolistSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TodolistSharedModule {
  static forRoot() {
    return {
      ngModule: TodolistSharedModule
    };
  }
}
