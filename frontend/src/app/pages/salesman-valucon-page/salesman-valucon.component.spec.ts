import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SalesmanValuconComponent} from "@app/pages/salesman-valucon-page/salesman-valucon.component";



describe('SalesmanValuconComponent', () => {
    let component: SalesmanValuconComponent;
    let fixture: ComponentFixture<SalesmanValuconComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SalesmanValuconComponent]
        });
        fixture = TestBed.createComponent(SalesmanValuconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
