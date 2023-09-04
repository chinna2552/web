import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
 selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {
  name: FormControl = new FormControl();
  email: FormControl = new FormControl();
  password: FormControl = new FormControl();

  
  customerArray: any[] = [];
  editingCustomer: any = null;
  showRegistrationForm = false;

  @Output() cancel = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.http.get("http://localhost:4000/users/users").subscribe((resultData: any) => {
      this.customerArray = resultData;
    });
  }

  setDelete(data: any){
    this.http.delete("http://localhost:4000/users/users" + "/" + data._id).subscribe((resultData: any) => {
      this.getAllCustomers();
    });
  }

  setUpdate(data: any){
    this.name.setValue(data.name);
    this.email.setValue(data.email);
    this.password.setValue(data.password);
    
    this.showRegistrationForm = true;
    this.editingCustomer = data;
  }

  save() {
    if (this.editingCustomer) {
      this.updateCustomer();
    } else {
      this.addCustomer();
    }

    this.clearForm();
    this.showRegistrationForm = false;
  }

  updateCustomer() {
    const bodyData = {
      "name": this.name.value,
      "email": this.email.value,
      "password": this.password.value,
    };

    const customerIdToUpdate = this.editingCustomer._id;

    this.http.put("http://localhost:4000/users/users" + "/" + customerIdToUpdate, bodyData)
      .subscribe((resultData: any) => {
        this.getAllCustomers();
      });
  }

  addCustomer() {
    const bodyData = {
      "name": this.name.value,
      "email": this.email.value,
      "password": this.password.value,
    };

    this.http.post("http://localhost:4000/users/users/register", bodyData)
      .subscribe((resultData: any) => {
        this.getAllCustomers();
      });
  }

  clearForm() {
    this.name.setValue("");
    this.email.setValue("");
    this.password.setValue("");
    this.editingCustomer = null;
  }

  onCancel() {
    this.clearForm();
    this.showRegistrationForm = false;
    this.cancel.emit();
  }
}
