import React from 'react';
import _ from 'underscore';
import ImageList from 'components/ImageList';
import Api from 'api';

export default class Thumbnails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            product_id: props.product_id, 
            items: props.images, 
            featured_image: props.featured_image,
        };
        this.onImageRemove = this.onImageRemove.bind(this);
        this.onUpdateFeaturedImage = this.onUpdateFeaturedImage.bind(this);
    }

    componentDidMount() {
        ImageList.onImageSelected = this.handleSelectedImage.bind(this);
    }

    handleSelectedImage(image, e){
        $('.modal').modal('hide');

        Api.products.add_image(this.state.product_id, image.id)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    items: result,
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    onImageRemove(image_id, e) {
        Api.products.remove_image(this.state.product_id, image_id)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    items: result,
                });

            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    onUpdateFeaturedImage(image_id, e){
        Api.products.update_featured_image(this.state.product_id, image_id)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    featured_image: result,
                });

                $('#thumbnail-image').attr('src', result.url);
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    render() {
        const { error, items, featured_image } = this.state;

        return (
            <div className="gallery gallery-widget" data-toggle="lightbox-gallery">
                <div className="row text-center">
                    {items.map((item, index) => (
                        <div className="col-sm-2" key={item.id}>
                            <a href={item.url} className="gallery-link">
                                <img src={item.url}/>
                            </a>
                            {(featured_image == null || item.id != featured_image.id) &&
                                [<a href="javascript:void(0)" key={'update'} className="btn btn-success btn-sm" onClick={(e)=>this.onUpdateFeaturedImage(item.id, e)}>
                                    <span className="fa fa-check-circle"></span>
                                </a>,
                                <a href="javascript:void(0)" key={'remove'} className="btn btn-danger btn-sm" onClick={(e)=>this.onImageRemove(item.id, e)}>
                                    <span className="fa fa-trash"></span>
                                </a>]
                            }
                        </div>
                    ))}
                    
                    <div className="col-sm-2">
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#imageModal" title="Add" className="btn btn-primary">
                            <i className="fa fa-plus"></i> Add New Image
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
