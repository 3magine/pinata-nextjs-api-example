import {PinataSDK} from 'pinata-web3';
// import { PinataSDK } from 'pinata';

import {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';
import fs from 'fs';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<boolean | any>
) => {
  try {
    const filePath = path.join(process.cwd(), 'assets', 'slapcity.png');

    const pinata = new PinataSDK({
      pinataJwt: process.env.IPFS_PINATA_JWT!,
    });

    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], {type: 'image/png'});
    const file = new File([blob], path.basename(filePath), {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    // Upload the buffer directly to Pinata
    const uploadResult = await pinata.upload.file(file, {
      metadata: {
        name: 'SlapCityNft',
      },
    });
    console.log('Uploaded to Pinata:', uploadResult);
    const newPhoto = `${process.env.NEXT_PUBLIC_GATEWAY_URL}${uploadResult.IpfsHash}`;

    return res.json({
      filePath,
      uploadResult,
      newPhoto,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json('Error uploading to Pinata');
  }
};

export default handler;
