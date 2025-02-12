import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { Flex, Box } from '@rebass/grid';
import { FormattedMessage } from 'react-intl';
import { set } from 'lodash';
import styled, { withTheme } from 'styled-components';

import { Check } from 'styled-icons/fa-solid/Check';

import defaultTheme from '../../../lib/theme';
import StyledButton from '../../StyledButton';
import StyledInput from '../../StyledInput';
import StyledCard from '../../StyledCard';
import Container from '../../Container';
import { P } from '../../Text';
import { EditCollectiveSettingsMutation } from '../graphql/mutations';
import StyledInputGroup from '../../StyledInputGroup';

const colorPath = 'collectivePage.primaryColor';

const ColorPreset = styled.button`
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 5px;
  margin-bottom: 8px;
  border-radius: 50%;
  border: none;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.25);
  }
`;

// prettier-ignore
const PRESET_COLORS = [
  '#BE2721', '#F65316', '#D17C07', '#1E824C', '#1D8882', '#1F3993', '#663299', '#2E3131',
  '#E94531', '#ED7529', '#F89308', '#19B156', '#12ADA4', '#3062BC', '#9E28B4', '#6D7A89',
  '#FA533E', '#F6A050', '#FFA413', '#1AC780', '#55C9BC', '#3E8DCE', '#B13BC6', '#95A5A6',
];

const CollectiveColorPicker = ({ collective, onChange, onClose, theme }) => {
  const color = theme.colors.primary[500];
  const [textValue, setTextValue] = React.useState(color.replace('#', ''));
  const hasError = textValue.length !== 6;
  const dispatchValue = v => {
    setTextValue(v.replace('#', ''));
    onChange(v);
  };

  return (
    <Mutation mutation={EditCollectiveSettingsMutation}>
      {(editSettings, { loading }) => (
        <StyledCard flexDirection="column" boxShadow="4px 4px 10px #c7c5c5" width={360}>
          <Box px={32} py={24}>
            <P fontSize="H5" fontWeight={600} mb={3}>
              <FormattedMessage id="CollectiveColorPicker.Title" defaultMessage="Select page color" />
            </P>
            <P fontSize="LeadParagraph" mb={3}>
              <FormattedMessage id="CollectiveColorPicker.Preset" defaultMessage="Preset colors" />
            </P>
            <Flex flexWrap="wrap" justifyContent="space-between">
              {PRESET_COLORS.map(preset => (
                <ColorPreset key={preset} style={{ background: preset }} onClick={() => dispatchValue(preset)}>
                  {color === preset && <Check size={12} color="white" />}
                </ColorPreset>
              ))}
            </Flex>
            <P fontSize="LeadParagraph" mt={3} mb={2}>
              <FormattedMessage id="CollectiveColorPicker.Custom" defaultMessage="Use custom color" />
            </P>
            <Flex>
              <StyledInput
                size={40}
                flex="0 0 40px"
                px={2}
                py={2}
                background="white"
                borderRadius="50%"
                type="color"
                value={color}
                disabled={loading}
                onChange={e => {
                  dispatchValue(e.target.value);
                }}
              />
              <StyledInputGroup
                prepend="#"
                placeholder="000000"
                px={2}
                containerProps={{ ml: 2 }}
                value={textValue}
                disabled={loading}
                error={hasError}
                onChange={e => {
                  const newValue = e.target.value.replace('#', '');
                  setTextValue(newValue);
                  if (newValue.length === 6) {
                    onChange(`#${newValue}`);
                  }
                }}
              />
            </Flex>
          </Box>
          <Container borderTop="1px solid #D7DBE0" p={2}>
            <Flex justifyContent="space-between">
              <StyledButton
                mx={2}
                textTransform="capitalize"
                onClick={() => {
                  dispatchValue(defaultTheme.colors.primary[500]);
                }}
              >
                <FormattedMessage id="Reset" defaultMessage="Reset" />
              </StyledButton>
              <Flex>
                <StyledButton
                  mx={2}
                  textTransform="capitalize"
                  onClick={() => {
                    onChange(null);
                    onClose();
                  }}
                >
                  <FormattedMessage id="form.cancel" defaultMessage="cancel" />
                </StyledButton>
                <StyledButton
                  mx={2}
                  buttonStyle="primary"
                  textTransform="capitalize"
                  loading={loading}
                  disabled={hasError}
                  onClick={() =>
                    editSettings({
                      variables: {
                        id: collective.id,
                        settings: set(collective.settings, colorPath, color),
                      },
                    }).then(() => {
                      onChange(null);
                      onClose();
                    })
                  }
                >
                  <FormattedMessage id="save" defaultMessage="save" />
                </StyledButton>
              </Flex>
            </Flex>
          </Container>
        </StyledCard>
      )}
    </Mutation>
  );
};

CollectiveColorPicker.propTypes = {
  collective: PropTypes.shape({
    id: PropTypes.number,
    settings: PropTypes.shape({
      collectivePage: PropTypes.shape({
        primaryColor: PropTypes.string,
      }),
    }),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  /** @ignore from withTheme */
  theme: PropTypes.object,
};

export default withTheme(CollectiveColorPicker);
