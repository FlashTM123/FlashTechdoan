import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Upload, Image as ImageIcon, X, Send, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Review {
    id: number;
    rating: number;
    content: string;
    images: string[] | null;
    created_at: string;
    user: {
        name: string;
        profile?: {
            avatar?: string;
        }
    }
}

interface Props {
    productId: number;
    auth: any;
}

export default function ReviewSection({ productId, auth }: Props) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form States
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/products/${productId}/reviews`);
            setReviews(res.data.data);
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + selectedImages.length > 5) {
            toast.error("Bạn chỉ có thể tải lên tối đa 5 hình ảnh.");
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setSelectedImages([...selectedImages, ...files]);
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setSelectedImages(newImages);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.user) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá.");
            return;
        }

        if (content.length < 10) {
            toast.error("Nội dung đánh giá phải ít nhất 10 ký tự.");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('rating', rating.toString());
        formData.append('content', content);
        selectedImages.forEach((image) => {
            formData.append('images[]', image);
        });

        try {
            const res = await axios.post(`/products/${productId}/reviews`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(res.data.message);
            
            // Reset form
            setContent('');
            setRating(5);
            setSelectedImages([]);
            setPreviews([]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 space-y-12">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Đánh giá từ khách hàng</h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Chia sẻ trải nghiệm của bạn về sản phẩm</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Review Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-32">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Viết đánh giá của bạn</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Star Selection */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Số sao đánh giá</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="transition-all duration-200 transform hover:scale-125"
                                        >
                                            <Star 
                                                className={cn(
                                                    "w-8 h-8",
                                                    (hoverRating || rating) >= star 
                                                        ? "fill-yellow-400 text-yellow-400" 
                                                        : "text-slate-200 dark:text-slate-700"
                                                )} 
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-3 text-sm font-black text-slate-400">
                                        {rating}/5 sao
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Nội dung đánh giá</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Bạn thấy sản phẩm này thế nào? (Chất lượng, đóng gói, giao hàng...)"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 rounded-3xl p-5 text-sm font-medium transition-all outline-none min-h-[150px] resize-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Hình ảnh thực tế (Tối đa 5)</label>
                                <div className="flex flex-wrap gap-3">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative w-20 h-20 group">
                                            <img src={preview} alt="preview" className="w-full h-full object-cover rounded-2xl border-2 border-slate-100 dark:border-slate-700" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {previews.length < 5 && (
                                        <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                            <Upload className="w-6 h-6 mb-1" />
                                            <span className="text-[10px] font-bold">Thêm ảnh</span>
                                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Gửi đánh giá ngay
                            </button>
                        </form>
                    </div>
                </div>

                {/* Review List */}
                <div className="lg:col-span-7 space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                            <p className="font-bold text-slate-400 animate-pulse">Đang tải các đánh giá...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div 
                                key={review.id} 
                                className="bg-white dark:bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg overflow-hidden shadow-lg shadow-indigo-500/10">
                                            {review.user.profile?.avatar ? (
                                                <img src={review.user.profile.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                review.user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white tracking-tight">{review.user.name}</h4>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star 
                                                        key={star} 
                                                        className={cn(
                                                            "w-3.5 h-3.5",
                                                            review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-200 dark:text-slate-700"
                                                        )} 
                                                    />
                                                ))}
                                                <span className="mx-2 text-slate-300 dark:text-slate-700 text-xs">|</span>
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/20">
                                        <ImageIcon className="w-3 h-3" />
                                        Đã mua hàng
                                    </div>
                                </div>

                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                                    {review.content}
                                </p>

                                {review.images && review.images.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mt-6">
                                        {review.images.map((img, idx) => (
                                            <div key={idx} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-500 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none">
                                                <img src={img} alt="review" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-900/20 border-2 border-dashed border-slate-100 dark:border-slate-800 p-20 rounded-[3rem] text-center">
                            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                <MessageSquare className="w-10 h-10 text-slate-300" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Chưa có đánh giá nào</h4>
                            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
