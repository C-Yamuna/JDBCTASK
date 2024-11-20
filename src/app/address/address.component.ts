import { Component, OnInit } from '@angular/core';
import { Address } from './shared/address.model';
import { FileUploader } from 'ng2-file-upload';
import { AddressService } from './shared/address.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({
    disableMultipart: false,
    autoUpload: false
  });
  uploadFlagSociety: boolean = true; 
  selectedDatabases: any[] = [];
  address: Address = new Address();
  sqlQuery: string = '';
  isUpdateEnabled: boolean = false;
  databases: { label: string; value: number }[] = [];
  msgs: any[] = [];

  
  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.getDatabaseDropdown();
  }

  getDatabaseDropdown() {
    this.addressService.getDropdownData()
      .subscribe((response: any) => {
        this.databases = response.map((db: any) => {
          return { label: db.index   }; 
        });
      }, error => {
        console.error("Error fetching dropdown data", error);
      });
  }

  // Enable or disable Update button based on conditions
  checkEnableUpdate() {
    this.isUpdateEnabled = !!this.sqlQuery && this.selectedDatabases.length > 0;
  }

  // Execute update based on SQL Query and selected databases
  executeUpdate() {
    // Define the payload with selected databases and SQL query
    const payload = {
      indexRange: this.selectedDatabases,
      query: this.sqlQuery
    };
    // Log payload for debugging
    console.log('Payload being sent to backend:', payload);
    // Call updateDatabase and handle the response
    this.addressService.updateDatabase(payload).subscribe(
      (response: any) => {
        console.log('Response from backend:', response);
        // Check if the response indicates a successful update
        if (response && response > 0) {
          alert('Database updated successfully with rows affected: ' + response);
        } else {
          alert('No rows were updated, or there was an issue with the query.');
        }
      },
      (error) => {
        console.error('Error updating database:', error);
        alert('Failed to update database. Please check the console for error details.');
      }
    );
  }


  // downloadQueryResultsAsCSV() {
  //   const queryPayload = {
  //     sqlQuery: this.sqlQuery,
  //     databases: this.selectedDatabases
  //   };

  //   this.addressService.downloadQueryResults(queryPayload).subscribe((response: Blob) => {
  //     const data: Blob = new Blob([response], { type: 'text/csv' });
  //     saveAs(data, 'QueryResults.csv');
  //     this.msgs = [{ severity: 'success', detail: 'CSV file downloaded successfully.' }];

  //     // Clear success message after 2 seconds
  //     setTimeout(() => {
  //       this.msgs = [];
  //     }, 2000);
  //   },
  //   error => {
  //     this.msgs = [{ severity: 'error', detail: 'Failed to download CSV. Server might be down.' }];

  //     // Clear error message after 2 seconds
  //     setTimeout(() => {
  //       this.msgs = [];
  //     }, 2000);
  //   });
  // }

 
  downloadQueryResultsAsCSV() {
    // Payload to send to the backend
    const queryPayload = {
      sqlQuery: this.sqlQuery,
      databases: this.selectedDatabases,
    };

    this.addressService.downloadQueryResults(queryPayload).subscribe(
      (response: Blob) => {
        if (response) {
          // Create a Blob from the response and download it as a CSV file
          const data: Blob = new Blob([response], { type: 'text/csv' });
          const filename = 'QueryResults.csv';
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.download = filename;
          link.click();

          // Success message
          this.msgs = [{ severity: 'success', detail: 'CSV file downloaded successfully.' }];
        } else {
          // No data returned from the server
          this.msgs = [{ severity: 'error', detail: 'No data available for download.' }];
        }

        // Clear messages after 2 seconds
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      },
      (error) => {
        // Handle errors
        console.error('Error downloading CSV:', error);
        this.msgs = [{ severity: 'error', detail: 'Failed to download CSV. Server might be down.' }];

        // Clear error messages after 2 seconds
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    );
  }

  
}
