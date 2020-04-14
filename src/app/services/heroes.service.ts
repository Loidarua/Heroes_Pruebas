import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import {map,delay} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url="https://login-app-86bb8.firebaseio.com"; // url de faaribase

  private url1="http://localhost:9090/heroe" // con el puerto 8080 trabaja en java  y con el puerto 9090 trabaja en scala (Spring Boot y Scala Akka)

  private token;
  private headers;

  constructor(private http:HttpClient,) { 
    var usuario={
      username : "admin1",
      password :"admin"
    };  
   this.token= null;    
    //es para autenticar el usuario anterior y crear un token 
    this.http.post("http://localhost:8080/",usuario).subscribe(resp=>this.token=resp);
   
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  crearHeroe(heroe:HeroeModel){

    return this.http.post(`${this.url1}/addheroe`,heroe)
                  .pipe(
                    map((resp:any)=>{
                      heroe.id= resp.id;
                      return heroe;
                    })
                  );
  }

  actualizarHeroe(heroe:HeroeModel){
    const heroeTemp={
      ...heroe
    };

   delete heroeTemp.id;

    return this.http.put(`${this.url1}/editheroe/${heroe.id}`,heroe);
  }
  
  borrarHeroe(id:string){

    return this.http.delete(`${this.url1}/removeheroe/${id}`);

  }

  getHeroe(id : string){
    console.log(this.token)
    this.headers= new HttpHeaders().set('Authorization',`${this.token}`);

    //para el consumo de un servicio con token
    this.http.get("http://localhost:8080/secureEndpoint",{headers:this.headers}).subscribe(resp=>console.log(resp))

    return this.http.get(`${this.url1}/getheroe/${id}`);

  }

  getHeroes(){   
    
    return this.http.get(`${this.url1}/getheroes`)
                      .pipe(map(resp=> this.crearArreglo(resp)),delay(0)
                      );

  }

  private crearArreglo(heroesObj: object){

   const heroes:HeroeModel[]=[];

   if (heroesObj === null){return [];}

   Object.keys(heroesObj).forEach(key=>{
     const heroe: HeroeModel=heroesObj[key];     
     heroes.push(heroe);
   });
   return heroes;
  }

}
