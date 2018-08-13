class SuccessResponse {
    constructor(result, message, value) {
        this.result = result;
        this.message = message;
        this.value = value;
    }
}

class ErrorResponse {
    constructor(result, message, error) {
        this.result = result;
        this.message = message;
        this.error = error;
    }
}

class DataTableResponse {
    constructor(draw, recordsTotal, data) {
        this.draw = draw;
        this.recordsTotal = recordsTotal;
        this.recordsFiltered = recordsTotal;
        this.data = data;
    }
}

const StandardResponse = { SuccessResponse, ErrorResponse, DataTableResponse};

module.exports = StandardResponse;
