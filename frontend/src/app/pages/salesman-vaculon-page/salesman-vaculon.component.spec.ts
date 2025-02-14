import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SalesmanVaculonComponent} from "@app/pages/salesman-vaculon-page/salesman-vaculon.component";



describe('SalesmanVaculonComponent', () => {
    let component: SalesmanVaculonComponent;
    let fixture: ComponentFixture<SalesmanVaculonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SalesmanVaculonComponent]
        });
        fixture = TestBed.createComponent(SalesmanVaculonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
