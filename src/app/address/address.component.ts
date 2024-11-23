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
  address: Address = new Address();
  sqlQuery: string = '';
  isUpdateEnabled: boolean = false;
  msgs: any[] = [];
  databases: { label: string; value: string }[] = []; // Dropdown options
  selectedDatabases: string[] = []; // Stores selected database indices
  message: string = ''; 

  constructor(private addressService: AddressService) { }

  ngOnInit(): void {
    this.getDatabaseDropdown();
  }

  getDatabaseDropdown() {
    this.addressService.getDropdownData().subscribe((response: any) => {
      this.databases = response.map((db: any) => ({
        label: db.dbName, // Human-readable label
        value: db.index   // Identifier for the database
      }));
    });
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

  downloadQueryResultsAsCSV() {
    const queryPayload = {
      sqlQuery: this.sqlQuery?.trim(), // Ensure SQL query is not null or empty
      databases: this.selectedDatabases // Array of selected database values
    };
    console.log('Payload being sent to backend:', queryPayload);
    if (!queryPayload.sqlQuery || queryPayload.databases?.length === 0) {
      console.error('SQL Query or Databases are missing!');
      return;
    }
    this.addressService.downloadQueryResults(queryPayload).subscribe(
      (response: Blob) => {
        const data: Blob = new Blob([response], { type: 'text/csv' });
        const filename = 'SelectQuery.csv';
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = filename;
        link.click();
      },
      (error) => {
        console.error('Error downloading CSV:', error);
      }
    );
  }

 
  checkEnableUpdate() {
    if (this.selectedDatabases.length === 1) {
      this.message = ''; // Clear any previous message
    } else if (this.selectedDatabases.length > 1) {
      this.message = 'Please select only one database.';
    }
  }

  // Download database dump
  downloadDatabaseDump() {
    if (this.selectedDatabases.length === 1) {
      const dbIndex = this.selectedDatabases[0];
      this.addressService.downloadDatabaseDump(dbIndex).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${dbIndex}_data_dump.sql`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(downloadUrl);
          this.message = 'Download started successfully!';
        },
        (error) => {
          console.error('Error downloading database dump:', error);
          this.message = 'Error downloading database dump. Please try again.';
        }
      );
    } else {
      this.message = 'Please select exactly one database.';
    }
  }
}
