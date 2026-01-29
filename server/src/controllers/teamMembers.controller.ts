import type { Request, Response } from 'express';
import { teamMembersService } from '../services/teamMembers.service.js';

export const getAll = async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const members = await teamMembersService.getAll(includeInactive);
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const member = await teamMembersService.getById(req.params.id);
    res.json(member);
  } catch (error: any) {
    if (error.message === 'Team member not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const member = await teamMembersService.create(req.body);
    res.status(201).json(member);
  } catch (error: any) {
    if (error.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const member = await teamMembersService.update(req.params.id, req.body);
    res.json(member);
  } catch (error: any) {
    if (error.message === 'Team member not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const softDelete = async (req: Request, res: Response) => {
  try {
    await teamMembersService.softDelete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Team member not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { type, animal, imageUrl } = req.body;

    if (!['initials', 'animal', 'custom'].includes(type)) {
      return res.status(400).json({ error: 'Invalid avatar type' });
    }

    const member = await teamMembersService.updateAvatar(req.params.id, {
      type,
      animal,
      imageUrl,
    });
    res.json(member);
  } catch (error: any) {
    if (error.message === 'Team member not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const linkToUser = async (req: Request, res: Response) => {
  try {
    const member = await teamMembersService.linkToUser(
      req.params.id,
      req.user!.id
    );
    res.json(member);
  } catch (error: any) {
    if (error.message === 'Team member not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};
