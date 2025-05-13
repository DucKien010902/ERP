const products = require('../model/products');
const carts = require('../model/cartsDB');
const vnpayConfig = require('../../config/VNPayConfig');
const querystring = require('qs');
class producController {
  async getallProducts(req, res) {
    try {
      const allProducts = await products.find({});
      return res.status(200).json(allProducts);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async getCarts(req, res) {
    try {
      const { email } = req.query;
      const ownCart = await carts.findOne({ email: email });
      return res.status(200).json(ownCart?.cart);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async addtoCarts(req, res) {
    try {
      const { email, Id, counts } = req.body;

      if (!email || !Id || !counts) {
        return res.status(400).json({ message: 'Thiếu dữ liệu' });
      }

      let userCart = await carts.findOne({ email });

      if (!userCart) {
        // Nếu chưa có giỏ hàng, tạo mới
        userCart = new carts({
          email,
          cart: [{ Id, counts }],
        });
      } else {
        // Đã có giỏ hàng → kiểm tra sản phẩm
        const productIndex = userCart.cart.findIndex((item) => item.Id === Id);

        if (productIndex !== -1) {
          // Nếu sản phẩm đã tồn tại → cộng số lượng
          userCart.cart[productIndex].counts += counts;
        } else {
          // Nếu sản phẩm chưa có → thêm mới
          userCart.cart.push({ Id, counts });
        }
      }

      await userCart.save();

      return res.status(200).json({ message: 'Thêm vào giỏ hàng thành công' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async removeFromCart(req, res) {
    try {
      const { email, Id } = req.body;

      if (!email || !Id) {
        return res
          .status(400)
          .json({ message: 'Thiếu email hoặc Id sản phẩm' });
      }

      // Xoá sản phẩm có Id khỏi giỏ hàng của người dùng
      const result = await carts.findOneAndUpdate(
        { email },
        { $pull: { cart: { Id } } },
        { new: true }
      );

      if (!result) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy giỏ hàng người dùng' });
      }

      return res.status(200).json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async addProduct(req, res) {
    try {
      const {
        Id,
        pdImage,
        pdName,
        pdDes,
        pdPrice,
        pdVouncher,
        pdCountSale,
        pdStar,
        pdDayDelivery,
      } = req.body;

      // Kiểm tra dữ liệu bắt buộc
      if (!pdName || !pdImage || !pdPrice) {
        return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
      }

      // Tạo sản phẩm mới
      const newProduct = new products({
        Id: Id || new Date().getTime().toString(), // sinh Id nếu thiếu
        pdImage,
        pdName,
        pdDes,
        pdPrice,
        pdVouncher: pdVouncher || 0,
        pdCountSale: pdCountSale || 0,
        pdStar: pdStar || 0,
        pdDayDelivery,
      });

      // Lưu vào database
      await newProduct.save();

      return res.status(201).json({ message: 'Thêm sản phẩm thành công' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm' });
    }
  }
}
module.exports = new producController();
