import { Component, OnInit } from '@angular/core';
import { FormBuilder ,Validators, FormGroup ,FormControl ,FormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/car';
import { CarDetail } from 'src/app/models/carDetail';
import { Customer } from 'src/app/models/customer';
import { CustomerDetail } from 'src/app/models/customerDetail';
import { CarService } from 'src/app/services/car.service';
import { CardtoService } from 'src/app/services/cardto.service';
import { CustomerService } from 'src/app/services/customer.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  customers: CustomerDetail[] = []; 
  customerss:Customer[]
  currentCustomer: number;
  currentCar: Car;
  
  totalPrice: number;

  rentDate: Date;
  ReturnDate: Date;

  rentalAddForm : FormGroup;

  constructor(private customerService: CustomerService,
    private carService: CarService,
    private rentalService : RentalService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService:ToastrService,
    private carDetailService:CardtoService) { }

  ngOnInit(): void {
    this.rentDate = new Date();
    this.ReturnDate = new Date();

    this.createRentalAddForm();

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['carID']) {
        this.getCarDetailsById(params['carID']);
      }
    });
  }
  
  createRentalAddForm(){
    this.rentalAddForm = this.formBuilder.group({
      carID: ["",Validators.required],
      customerID : ["",Validators.required],
      rentDate : ["",Validators.required],
      ReturnDate:["",Validators.required]     
    })
  }

  add(){
    if(this.rentalAddForm.valid){
      let rentalModel = Object.assign({},this.rentalAddForm.value)
      this.rentalService.addRental(rentalModel).subscribe (
        response=>{  this.toastrService.success(response.message,"Başarılı")  },
        responseError=> {
          if(responseError.error.Errors.length>0){
            for (let i = 0; i <responseError.error.Errors.length; i++) {
              this.toastrService.error(responseError.error.Errors[i].ErrorMessage,"Doğrulama hatası")
            }       
          } 
        }
      )      
    }else{
      this.toastrService.error("Formunuz eksik","Dikkat")
    }    
  }

  getCustomerDetails() {
    this.customerService.getCustomerDetails().subscribe((response) => {
      this.customers = response.data
    });
  }

  getCarDetailsById(carId:number){
    this.carDetailService.getcardetail(carId).subscribe(response=>{
      this.currentCar = response.data[0];
      console.log(this.currentCar);
    })
  }

  getCustomers(){
    this.customerService
    .getcustomers()
    .subscribe((response) => {
      this.customerss=response.data
    })
  }

  
  
}
