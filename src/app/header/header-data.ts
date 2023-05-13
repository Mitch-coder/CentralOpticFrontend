import { EventEmitter, Injectable, Output } from "@angular/core";

// pss parametros estaticos :^
export class HeaderData{
    static eventBtnClick = true;
    static headerText:Event;
}


//Esta clase inyectable se supone que es para poder hacer lo que mandar los cambios
// y poder recibirlos los datos
@Injectable()
export class HeaderSearch {
 
//   isOpen:any = true; 
 
// static miVariable: string = "Valor inicial";
static observadores: ((valor: Event) => void)[] = [];

static notificar() {
  console.log(HeaderData.headerText)
  HeaderSearch.observadores.forEach((observador) =>
    observador(HeaderData.headerText)
  );
}

static setMiVariable(nuevoValor: Event) {
  HeaderData.headerText = nuevoValor;
  HeaderSearch.notificar();
}




  @Output() change: EventEmitter<any> = new EventEmitter();
 
  

  toggle(event : Event) {
    HeaderData.headerText = event;
    // console.log(event)
    // this.isOpen = !this.isOpen;
    this.change.emit(HeaderData.headerText)
  }

}