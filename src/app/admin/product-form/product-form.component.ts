import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../service/category.service';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {FormBuilder, FormControl, FormControlDirective, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../models/product';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$: Observable<any[]>;
  product$: Observable<any>;
  productForm: FormGroup;
  isSubmit = false;
  product = {} as Product;
  productId: string;

  constructor(private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) {

    this.categories$ = categoryService.getListCategories()
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            return ({ key: a.key, ...a.payload.val() });
          })
        ));

    // ToLearn: This method will return node's key and node's value are compied
    /*this.categoryService.getListCategories().snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          console.log('a', a.key);
          console.log('payload', a.payload.val());
          return ({ key: a.key, ...a.payload.val() });
        })
      )
    ).subscribe(items => {
      console.log('items', items)
      return items.map(item => {
        console.log('item', item);
        return item.key;
      });
    });*/

    // This function will return all the node's value
    /*this.categoryService.getListCategories()
      .valueChanges()
      .subscribe(data => {
        console.log('data', data);
      });*/

  }

  get title() {
    return this.productForm.get('title');
  }
  get price() {
    return this.productForm.get('price');
  }
  get category() {
    return this.productForm.get('category');
  }
  get imageUrl() {
    return this.productForm.get('imageUrl');
  }

  ngOnInit() {
    this.productForm = this.initProductForm();

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId !== 'new') {
      this.productService.getProduct(this.productId).subscribe( (product: Product) => {
        this.product = product;
        // this.fillTheProductForm(product);
      });
    }
  }

  submitProductForm() {
    let product = this.productForm.value;
    console.log('[ProductFormComponent][submitProductForm()] form product value:', product);
    this.isSubmit = true;

    if (this.productForm.valid) {
      this.isSubmit = false;

      if (this.productId === 'new') {
        this.productService.createProduct(product);
      } else {
        this.productService.updateProduct(this.productId, product);
      }

      this.router.navigate(['admin/products']);
    }
  }

  initProductForm() {
    return this.formBuilder.group({
      title: ['', [
        Validators.required
      ]],
      price: ['', [
        Validators.required
      ]],
      category: ['', [
        Validators.required
      ]],
      imageUrl: ['', [
        Validators.required
      ]]
    });
  }

  deleteProduct() {
    if (!confirm('Are you sure?')) return;

    this.productService.deteleProduct(this.productId);
    this.router.navigate(['admin/products']);
  }

  /*fillTheProductForm(product: Product) {
    this.title.setValue(product.title);
    this.price.setValue(product.price);
    this.imageUrl.setValue(product.imageUrl);
    this.category.setValue(product.category);
  }*/

}
