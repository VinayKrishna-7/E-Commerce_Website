const prisma = require('../config/prisma');

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const { recipientName, phone, addressLine, city, state, postalCode, isDefault } = req.body;
    const userId = req.user.id;

    if (!recipientName || !phone || !addressLine || !city || !postalCode) {
      return res.status(400).json({ message: 'All address fields are required.' });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        state: state ? state.trim() : null,
        postalCode: postalCode.trim(),
        isDefault: !!isDefault,
      },
    });

    res.status(201).json({ success: true, message: 'Address added.', address });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { recipientName, phone, addressLine, city, state, postalCode, isDefault } = req.body;
    const userId = req.user.id;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        recipientName: recipientName?.trim(),
        phone: phone?.trim(),
        addressLine: addressLine?.trim(),
        city: city?.trim(),
        state: state ? state.trim() : null,
        postalCode: postalCode?.trim(),
        isDefault: isDefault !== undefined ? !!isDefault : existing.isDefault,
      },
    });

    res.json({ success: true, message: 'Address updated.', address: updated });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    await prisma.address.delete({ where: { id } });

    res.json({ success: true, message: 'Address deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
