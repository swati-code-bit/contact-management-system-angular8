import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.css"],
})
export class FilterComponent implements OnInit {
  @Output() filtersApplied = new EventEmitter<any>();

  personal = { family: false, friends: false };
  professional = { colleagues: false, clients: false, businessPartners: false };
  others = { acquaintances: false };
  startDate: string = "";
  endDate: string = "";

  panelOpenState = false;

  ngOnInit(): void {}

  applyFilters() {
    const filters = {
      categories: this.getCategoryFilter(),
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.filtersApplied.emit(filters);
    console.log("Filters applied", filters);
  }

  // Get the selected categories as an array
  getCategoryFilter() {
    const categories = [];
    if (this.personal.family || this.personal.friends) categories.push("Personal");
    if (
      this.professional.colleagues ||
      this.professional.clients ||
      this.professional.businessPartners
    )
      categories.push("Professional");
    if (this.others.acquaintances) categories.push("Others");

    return categories;
  }

  // Clear all the filters
  clearFilters() {
    this.personal = { family: false, friends: false };
    this.professional = {
      colleagues: false,
      clients: false,
      businessPartners: false,
    };
    this.others = { acquaintances: false };
    this.startDate = "";
    this.endDate = "";
    this.applyFilters(); // Emit cleared filters
    console.log("Filters cleared");
  }

  // Toggle selection for personal categories
  togglePersonal() {
    const allSelected = this.isAllPersonalSelected();
    this.personal.family = !allSelected;
    this.personal.friends = !allSelected;
  }

  // Toggle selection for professional categories
  toggleProfessional() {
    const allSelected = this.isAllProfessionalSelected();
    this.professional.colleagues = !allSelected;
    this.professional.clients = !allSelected;
    this.professional.businessPartners = !allSelected;
  }

  // Toggle selection for others category
  toggleOthers() {
    const allSelected = this.isAllOthersSelected();
    this.others.acquaintances = !allSelected;
  }

  // Check if all personal categories are selected
  isAllPersonalSelected() {
    return this.personal.family && this.personal.friends;
  }

  // Check if all professional categories are selected
  isAllProfessionalSelected() {
    return (
      this.professional.colleagues &&
      this.professional.clients &&
      this.professional.businessPartners
    );
  }

  // Check if all other categories are selected
  isAllOthersSelected() {
    return this.others.acquaintances;
  }

  // Validate and handle birthday range changes
  onBirthdayRangeChange() {
    console.log("Birthday range changed", this.startDate, this.endDate);
  }

  // Convert date string to Date object for comparison
 

  // Ensure that the start and end dates are valid Date objects and apply the filters properly
 
}
