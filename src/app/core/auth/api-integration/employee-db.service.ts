// employee-db.service.ts
import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';

interface EmployeeDB extends DBSchema {
    employees: {
        key: number;
        value: { id: number; name: string; role: string; date_from: string, date_to: string };
    };
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeDbService {
    private db: any;

    constructor() {
        this.db = openDB<EmployeeDB>('employee-db', 1, {
            upgrade(db) {
                db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
            }
        });
    }

    async addEmployee(employee: { name: string; role: string; date_from: string; date_to: string; }, value?: any) {
        const db = await this.db;
        return db.add('employees', employee);
    }

    async getEmployees() {
        const db = await this.db;
        return db.getAll('employees');
    }

    async deleteEmployee(id: number) {
        const db = await this.db;
        return db.delete('employees', id);
    }

    async updateEmployee(id: number, updatedData: { name: string; role: string; date_from: string, date_to: string }) {
        const db = await this.db;
        return db.put('employees', { id, ...updatedData });
    }

    async getEmployeeById(id: number) {
        const db = await this.db;
        return db.get('employees', id);
    }
}
