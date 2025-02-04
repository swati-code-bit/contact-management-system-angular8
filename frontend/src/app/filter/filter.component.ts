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
    this.applyFilters();
    console.log("Filters cleared");
  }

  togglePersonal() {
    const allSelected = this.isAllPersonalSelected();
    this.personal.family = !allSelected;
    this.personal.friends = !allSelected;
  }

  toggleProfessional() {
    const allSelected = this.isAllProfessionalSelected();
    this.professional.colleagues = !allSelected;
    this.professional.clients = !allSelected;
    this.professional.businessPartners = !allSelected;
  }

  toggleOthers() {
    const allSelected = this.isAllOthersSelected();
    this.others.acquaintances = !allSelected;
  }

  isAllPersonalSelected() {
    return this.personal.family && this.personal.friends;
  }

  isAllProfessionalSelected() {
    return (
      this.professional.colleagues &&
      this.professional.clients &&
      this.professional.businessPartners
    );
  }

  isAllOthersSelected() {
    return this.others.acquaintances;
  }

  onBirthdayRangeChange() {
    console.log("Birthday range changed", this.startDate, this.endDate);
  }
}
