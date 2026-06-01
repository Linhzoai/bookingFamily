import prisma from "#config/prisma.js";
import {paginatePrisma} from "#helper/prisma.helper.js";
import checkRecordExist from "#utils/check-exist.js";

class ReviewService{
    createReview = async (data) => {
        const [booking, customer, staff ] = await Promise.all([
            checkRecordExist(prisma.booking, {id: data.bookingId}),
            checkRecordExist(prisma.user, {id: data.customerId, role: 'customer'}),
            checkRecordExist(prisma.user, {id: data.staffId, role: 'staff'}),
        ])
        const review = await prisma.review.create({
            data: {
                ...data,
                bookingId: booking.id,
                customerId: customer.id,
                staffId: staff.id,
            }
        })
        return review;
    }

    updateReview = async (id, data) => {
        const numericId = Number(id);
        const review = await checkRecordExist(prisma.review, {id: numericId});
        const updatedReview = await prisma.review.update({
            where: {id: numericId},
            data
        })
        return updatedReview
    }

    deleteReview = async (id) => {
        const numericId = Number(id);
        await checkRecordExist(prisma.review, {id: numericId});
        await prisma.review.delete({where: {id: numericId}});
        return;
    }

    getReview = async (data) => {
        const query = {}
        if(data.bookingId) query.bookingId = data.bookingId;
        if(data.customerId) query.customerId = data.customerId;
        if(data.staffId) query.staffId = data.staffId;
        if(data.type) query.type = data.type;
        if(data.rating) query.rating = data.rating;
        const listReviews = await paginatePrisma( prisma.review, query, data );
        return listReviews;
    }

    

 }

 export default new ReviewService();