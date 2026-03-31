export class MetaDto {
    totalItems: number;
    itemCont: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: number;
    hasPreviousPage: number;

    constructor(
        totalItems: number,
        itemCont: number,
        itemsPerPage: number,
        totalPages: number,
        currentPage: number,
        hasNextPage: number,
        hasPreviousPage: number
    ) {
        this.totalItems = totalItems;
        this.itemCont = itemCont; 
        this.itemsPerPage = itemsPerPage;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.hasNextPage = hasNextPage;
        this.hasPreviousPage = hasPreviousPage;
    }
}