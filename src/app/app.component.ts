import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from './employee.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees: Employee[] = [];
  public editEmployee!: Employee;
  public deleteEmployee!: Employee;


  constructor(private employeeService:  EmployeeService) {}

  //kad god se inicijalizuje ova komponenta pozivace se getEmployees funkcija 
  ngOnInit(): void {
    this.getEmployees();
  }

  //observable je povratni tip 
  //moram da odradim subscribe 
  public getEmployees(): void{
    this.employeeService.getEmployees().subscribe(
      (response : Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm) : void {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee) : void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number) : void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string) : void {
    const results: Employee[] = []; 
    for(const employee of this.employees) {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||  employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||  employee.imageUrl.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||  employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||  employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1)
      {
        results.push(employee);
      }
    }

    this.employees = results; 

    if(results.length === 0 || !key) {
      this.getEmployees(); 
    }
  }


  //mode moze biti add/edit/delete
  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button'; //default je submit, sad je button 
    button.style.display = 'none'; //hide in UI , vec imam olovcicu i add employee 
    button.setAttribute('data-toggle','modal'); 

    if(mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }

    if(mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }

    if(mode === 'delete') {
      this.deleteEmployee= employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  
}
