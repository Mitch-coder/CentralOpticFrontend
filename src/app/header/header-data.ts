import { EventEmitter, Injectable, Output } from "@angular/core";

// pss parametros estaticos :^
export class HeaderData {
  static eventBtnClick = true;
  static headerText: Event;
}


//Esta clase inyectable se supone que es para poder hacer lo que mandar los cambios
// y poder recibirlos los datos
@Injectable()
export class HeaderSearch {
  static observadores: ((valor: Event) => void)[] = [];

  static notificar() {
    // console.log(HeaderData.headerText)
    HeaderSearch.observadores.forEach((observador) =>
      observador(HeaderData.headerText)
    );
  }

  static setMiVariable(nuevoValor: Event) {
    HeaderData.headerText = nuevoValor;
    HeaderSearch.notificar();
  }
  @Output() change: EventEmitter<any> = new EventEmitter();
  toggle(event: Event) {
    HeaderData.headerText = event;
    this.change.emit(HeaderData.headerText)
  }
}


@Injectable()
export class EventBtnClick {
  static observadores: ((valor: boolean) => void)[] = [];

  static notificar() {
    EventBtnClick.observadores.forEach((observador) =>
      observador(HeaderData.eventBtnClick)
    );
  }

  static setMiVariable(nuevoValor: boolean) {
    HeaderData.eventBtnClick = nuevoValor;
    EventBtnClick.notificar();
  }

  @Output() change: EventEmitter<any> = new EventEmitter();
  toggle(event: boolean) {
    HeaderData.eventBtnClick = event;
    this.change.emit(HeaderData.eventBtnClick)
  }
}